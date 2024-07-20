import {
  Injectable,
  Logger,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { UpsertCustomerDto } from '../dtos/upsertCustomer.dto';
import { OAuthProvider } from '../configurations/constant';
import { ERRORS } from '../configurations/error';

@Injectable()
export class CustomersService {
  private logger: Logger = new Logger('CustomersService');

  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  public async getCustomerByEmail(email: string): Promise<Customer> {
    this.logger.debug(`Entered customer service getCustomerByEmail(${email})`);
    const customer: Customer = await this.customerRepository.findOne({
      where: {
        email: email,
      },
    });
    this.logger.log(`Customer info fetched for customer ${email}.`);
    this.logger.debug(`Exited customer service getCustomerByEmail()`);
    return customer;
  }

  public async addCustomer(
    customerRegistrationDto: UpsertCustomerDto,
    provider: OAuthProvider,
  ): Promise<Customer> {
    try {
      this.logger.debug(
        `Entered customer service addCustomer(${JSON.stringify(
          customerRegistrationDto,
        )})`,
      );

      const { email } = customerRegistrationDto;

      if (email) {
        const customer: Customer = await this.customerRepository.findOne({
          where: { email: email },
        });

        if (customer)
          throw new BadRequestException(ERRORS.CUSTOMER_EMAIL_EXISTS.code);
      }

      const customerEntity: Customer =
        customerRegistrationDto.toCustomerEntity(provider);

      const createdCustomer =
        await this.customerRepository.save(customerEntity);

      if (!createdCustomer)
        throw new InternalServerErrorException(
          ERRORS.CUSTOMER_CREATION_FAILED.code,
        );

      this.logger.debug(`Exited customer service addCustomer()`);
      return createdCustomer;
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  public async isCustomerActive(customerId: number): Promise<boolean> {
    this.logger.debug(
      `Entered customer service isCustomerActive(${customerId})`,
    );
    const customer = await this.customerRepository.findOne({
      where: { customerId: customerId },
    });
    this.logger.debug(`Exited customer service isCustomerActive()`);
    return customer && customer.is_active;
  }

  public async activateCustomer(customerId: number): Promise<void> {
    try {
      this.logger.debug(
        `Entered customer service activateCustomer(${customerId})`,
      );
      await this.customerRepository.update(customerId, {
        is_active: true,
        updated_at: new Date(),
      });

      this.logger.log(`Account activated for customer ${customerId}`);
      this.logger.debug(`Exited customer service activateCustomer()`);
    } catch (error) {
      this.logger.error(error);
      this.logger.debug(
        `Exited customer service activateCustomer() with error`,
      );
      throw error;
    }
  }
}
